export default {
  locales: {
    chinese: 'Chinese',
    english: 'English',
  },
  api: {
    operationSuccess: 'Operation Success',
    operationFailed: 'Operation failed',
    errorTip: 'Error Tip',
    successTip: 'Success Tip',
    errorMessage: 'The operation failed, the system is abnormal!',
    timeoutMessage: 'Login timed out, please log in again!',
    apiTimeoutMessage:
      'The interface request timed out, please refresh the page and try again!',
    apiRequestFailed: 'The interface request failed, please try again later!',
    networkException: 'network anomaly',
    networkExceptionMsg:
      'Please check if your network connection is normal! The network is abnormal',

    errMsg401:
      'The user does not have permission (token, user name, password error)!',
    errMsg403: 'The user is authorized, but access is forbidden!',
    errMsg404: 'Network request error, the resource was not found!',
    errMsg405: 'Network request error, request method not allowed!',
    errMsg408: 'Network request timed out!',
    errMsg500: 'Server error, please contact the administrator!',
    errMsg501: 'The network is not implemented!',
    errMsg502: 'Network Error!',
    errMsg503:
      'The service is unavailable, the server is temporarily overloaded or maintained!',
    errMsg504: 'Network timeout!',
    errMsg505: 'The http version does not support the request!',
  },
  login: {
    accountRule: 'Please input account',
    passwordRule: 'Please input password',
    passwordRuleReg:
      'The password format should be any combination of 8-18 digits',
    verifyCodeReg: 'Please enter verify code',
    verifyCodeCorrectReg: 'Please enter correct verify code',
    verifyCodeSixReg: 'Please enter a 6-digit verify code',

    loginButton: 'Sign in',
    registerButton: 'Sign up',
    rememberMe: 'Remember me',
    forgetPassword: 'Forget Password?',
    otherSignIn: 'Sign in with',

    // placeholder
    accountPlaceholder: 'Please input username',
    passwordPlaceholder: 'Please input password',
    verifyCodePlaceholder: 'Please input verifyCode',
    smsPlaceholder: 'Please input sms code',
    mobilePlaceholder: 'Please input mobile',
    policyPlaceholder: 'Register after checking',
    diffPwd: 'The two passwords are inconsistent',

    thirdLogin: 'Third Login',
    phoneLogin: 'Phone Login',
    qRCodeLogin: 'QRCode Login',
    register: 'Register',
    weChatLogin: 'WeChat Login',
    alipayLogin: 'Alipay Login',
    qqLogin: 'QQ Login',
    weiboLogin: 'Weibo Login',
  },
}
