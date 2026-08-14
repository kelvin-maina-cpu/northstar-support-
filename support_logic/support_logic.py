"""
Northstar Support Deflection MVP
Support Logic / Business Rules

MVP Categories:
1. Order Status
2. Returns & Refunds

This module defines the decision rules for customer support requests.
It does not create or modify a database and does not define API contracts.
"""

import re


# ============================================================
# 1. SUPPORTED INTENTS
# ============================================================

ORDER_STATUS_KEYWORDS = [
    "where is my order",
    "where's my order",
    "track my order",
    "track order",
    "order status",
    "status of my order",
    "has my order shipped",
    "has my order been shipped",
    "when will my order arrive",
    "when will my order be delivered",
    "delivery status",
    "is my order still processing",
    "has my order been delivered",
]

RETURN_KEYWORDS = [
    "return my order",
    "return my item",
    "return this item",
    "how do i return",
    "how can i return",
    "can i return",
    "eligible for return",
    "return eligibility",
    "return status",
    "how to return",
]

REFUND_KEYWORDS = [
    "where is my refund",
    "refund status",
    "has my refund been processed",
    "when will i get my refund",
    "when will i receive my refund",
    "refund processed",
    "refund pending",
]


# ============================================================
# 2. TEXT NORMALIZATION
# ============================================================

def normalize_text(message):
    """
    Convert customer input into a consistent format
    for rule matching.
    """

    if not isinstance(message, str):
        return ""

    message = message.lower().strip()
    message = re.sub(r"\s+", " ", message)

    return message


# ============================================================
# 3. INTENT DETECTION
# ============================================================

def detect_intent(message):
    """
    Determine what the customer is asking about.

    Returns:
        "order_status"
        "return"
        "refund"
        None
    """

    message = normalize_text(message)

    if not message:
        return None

    # Check refunds first because refund questions
    # may also contain the word "order".
    for keyword in REFUND_KEYWORDS:
        if keyword in message:
            return "refund"

    for keyword in RETURN_KEYWORDS:
        if keyword in message:
            return "return"

    for keyword in ORDER_STATUS_KEYWORDS:
        if keyword in message:
            return "order_status"

    return None


# ============================================================
# 4. ORDER NUMBER EXTRACTION
# ============================================================

def extract_order_number(message):
    """
    Try to find an order number in the customer's message.

    Examples:
        "Where is order #12345?"
        "Check order 12345"
        "My order number is 12345"

    Returns:
        Order number as a string, or None if not found.
    """

    if not isinstance(message, str):
        return None

    patterns = [
        r"#(\d+)",
        r"\border\s*#?(\d+)\b",
        r"\border\s+number\s*(?:is\s*)?#?(\d+)\b",
    ]

    for pattern in patterns:
        match = re.search(pattern, message.lower())

        if match:
            return match.group(1)

    return None


# ============================================================
# 5. ORDER STATUS RULES
# ============================================================

def order_status_rules(message):
    """
    Apply business rules for Order Status requests.

    This function does NOT retrieve data from the database.
    The backend can use the returned information to perform
    the actual lookup.
    """

    order_number = extract_order_number(message)

    # OS-01:
    # Order number is required.
    if not order_number:
        return {
            "category": "order_status",
            "intent": "order_status",
            "action": "request_information",
            "required_information": ["order_number"],
            "response": "Please provide your order number."
        }

    # The business logic tells the backend what information
    # needs to be retrieved.
    return {
        "category": "order_status",
        "intent": "order_status",
        "action": "lookup_order",
        "order_number": order_number,
        "required_information": [],
        "response": None
    }


# ============================================================
# 6. RETURN RULES
# ============================================================

def return_rules(message):
    """
    Apply business rules for return requests.

    This function determines what information is required.
    It does not check the database itself.
    """

    order_number = extract_order_number(message)

    # RR-01 / RR-06:
    # Order number is required when checking a specific order.
    if not order_number:
        return {
            "category": "returns",
            "intent": "return",
            "action": "request_information",
            "required_information": ["order_number"],
            "response": (
                "Please provide your order number so I can "
                "help with your return."
            )
        }

    return {
        "category": "returns",
        "intent": "return",
        "action": "check_return_eligibility",
        "order_number": order_number,
        "required_information": [],
        "response": None
    }


# ============================================================
# 7. REFUND RULES
# ============================================================

def refund_rules(message):
    """
    Apply business rules for refund requests.

    This function does not access the database.
    """

    order_number = extract_order_number(message)

    # RR-06:
    # Order number is required to check a refund.
    if not order_number:
        return {
            "category": "refund",
            "intent": "refund",
            "action": "request_information",
            "required_information": ["order_number"],
            "response": "Please provide your order number."
        }

    return {
        "category": "refund",
        "intent": "refund",
        "action": "lookup_refund",
        "order_number": order_number,
        "required_information": [],
        "response": None
    }


# ============================================================
# 8. UNKNOWN REQUEST RULE
# ============================================================

def unknown_request_rule():
    """
    Handle requests that do not match a supported MVP category.
    """

    return {
        "category": None,
        "intent": None,
        "action": "clarify",
        "required_information": [],
        "response": (
            "Could you clarify whether you need help with "
            "your order status, a return, or a refund?"
        )
    }


# ============================================================
# 9. MAIN SUPPORT ROUTER
# ============================================================

def handle_support_request(message):
    """
    Main entry point for the Support Logic module.

    The backend can call this function with the customer's
    message.

    Example:

        result = handle_support_request(
            "Where is my order #12345?"
        )
    """

    if not isinstance(message, str) or not message.strip():
        return {
            "category": None,
            "intent": None,
            "action": "request_information",
            "required_information": ["customer_message"],
            "response": "Please enter your support request."
        }

    intent = detect_intent(message)

    if intent == "order_status":
        return order_status_rules(message)

    if intent == "return":
        return return_rules(message)

    if intent == "refund":
        return refund_rules(message)

    return unknown_request_rule()


# ============================================================
# 10. EXAMPLE TESTS
# ============================================================

if __name__ == "__main__":

    test_requests = [
        "Where is my order?",
        "Where is my order #12345?",
        "Has order 12345 shipped?",
        "How do I return my order?",
        "Can I return order #12345?",
        "Where is my refund?",
        "Where is my refund for order #12345?",
        "Hello, I need help",
    ]

    for request in test_requests:
        result = handle_support_request(request)

        print("\nCustomer:", request)
        print("System:", result)