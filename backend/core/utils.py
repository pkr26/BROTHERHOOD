import random
import string
from sqlalchemy.orm import Session
from models import User


def generate_unique_username(db: Session, max_attempts: int = 100) -> str:
    """
    Generate a unique 8-character username with letters and numbers.

    Args:
        db: Database session
        max_attempts: Maximum number of attempts to generate a unique username

    Returns:
        A unique 8-character username

    Raises:
        ValueError: If unable to generate a unique username after max_attempts
    """
    # Characters to use: uppercase, lowercase letters and digits
    characters = string.ascii_letters + string.digits

    for _ in range(max_attempts):
        # Generate random 8-character username
        username = ''.join(random.choices(characters, k=8))

        # Check if username already exists
        existing_user = db.query(User).filter(User.username == username).first()

        if not existing_user:
            return username

    # If we couldn't generate a unique username after max_attempts
    raise ValueError(f"Could not generate a unique username after {max_attempts} attempts")


def generate_username_from_name(first_name: str, last_name: str, db: Session) -> str:
    """
    Alternative method: Generate username based on user's name with random suffix.
    Format: first2letters + last2letters + 4random characters

    Args:
        first_name: User's first name
        last_name: User's last name
        db: Database session

    Returns:
        A unique 8-character username
    """
    # Get first 2 letters of first name and last name (lowercase)
    first_part = first_name[:2].lower() if len(first_name) >= 2 else first_name.lower().ljust(2, 'x')
    last_part = last_name[:2].lower() if len(last_name) >= 2 else last_name.lower().ljust(2, 'x')

    # Characters for random part
    characters = string.ascii_lowercase + string.digits

    for _ in range(100):
        # Generate 4 random characters
        random_part = ''.join(random.choices(characters, k=4))

        # Combine to create username
        username = first_part + last_part + random_part

        # Check if username already exists
        existing_user = db.query(User).filter(User.username == username).first()

        if not existing_user:
            return username

    # Fallback to completely random username
    return generate_unique_username(db)