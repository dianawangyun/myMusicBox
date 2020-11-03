from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField
from wtforms.validators import DataRequired, InputRequired, Email, Length, EqualTo, Optional, URL


class UserAddForm(FlaskForm):
    """Sign up form."""

    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])
    confirm = PasswordField("Repeat Password", validators=[
        InputRequired(), EqualTo('password', message='Password must match')])
    email = StringField('E-mail', validators=[DataRequired(), Email()])


class LoginForm(FlaskForm):
    """Login form."""

    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])


class EditProfileForm(FlaskForm):
    """Edit Profile Form."""

    username = StringField('Username', validators=[DataRequired()])
    email = StringField('E-mail', validators=[DataRequired(), Email()])
    password = PasswordField(
        "Please input your password", validators=[DataRequired()])
