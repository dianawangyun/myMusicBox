from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField
from wtforms.validators import DataRequired, Email, Length, Optional, URL


class SearchForm(FlaskForm):
    """Form for adding/editing messages."""

    search = StringField('Search Something!', validators=[DataRequired()])
