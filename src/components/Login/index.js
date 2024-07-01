import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {useState} from 'react'
import ThemeContext from '../../context/ThemeContext'
import {
  LoginContainer,
  LoginFormContainer,
  ImageContainer,
  Logo,
  InputLabelContainer,
  Label,
  CheckBoxLabelContainer,
  InputBox,
  CheckBox,
  LoginButton,
  ErrorMsg,
} from './styledComponents'

const Login = props => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const onChangeUsername = event => {
    setUserName(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const onShowPasswordsClicked = () => {
    const passwordEl = document.getElementById('password')
    if (passwordEl.type === 'password') {
      passwordEl.type = 'text'
    } else {
      passwordEl.type = 'password'
    }
  }

  const onSubmitSuccess = jwtToken => {
    const {history} = props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  const onSubmitFailure = err => {
    setShowErrorMsg(true)
    setErrorMsg(err)
  }

  const submitForm = async event => {
    event.preventDefault()

    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg)
    }
  }

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Redirect to="/" />
  }
  return (
    <ThemeContext>
      {value => {
        const {isDarkTheme} = value
        // const websiteLogo = isDarkTheme
        // ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'
        // : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'

        return (
          <LoginContainer darkMode={isDarkTheme}>
            <LoginFormContainer darkMode={isDarkTheme} onSubmit={submitForm}>
              <ImageContainer>
                <Logo
                  src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
                  alt="website logo"
                />
              </ImageContainer>
              <InputLabelContainer>
                <Label darkMode={isDarkTheme} htmlFor="username">
                  USERNAME
                </Label>
                <InputBox
                  id="username"
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={onChangeUsername}
                />
              </InputLabelContainer>
              <InputLabelContainer>
                <Label darkMode={isDarkTheme} htmlFor="password">
                  PASSWORD
                </Label>
                <InputBox
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={onChangePassword}
                />
              </InputLabelContainer>
              <CheckBoxLabelContainer>
                <CheckBox
                  type="checkbox"
                  id="checkbox"
                  onClick={onShowPasswordsClicked}
                />
                <Label darkMode={isDarkTheme} htmlFor="checkbox">
                  Show Password
                </Label>
              </CheckBoxLabelContainer>
              <LoginButton type="submit">Login</LoginButton>
              {showErrorMsg && <ErrorMsg>*{errorMsg}</ErrorMsg>}
            </LoginFormContainer>
          </LoginContainer>
        )
      }}
    </ThemeContext>
  )
}

export default Login
