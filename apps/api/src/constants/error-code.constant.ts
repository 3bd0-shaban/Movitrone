export enum ErrorEnum {
  DEFAULT = '0: Unknown error',
  SERVER_ERROR = '500: Service busy, please try again later',

  SYSTEM_USER_EXISTS = '1001: System user already exists',
  INVALID_VERIFICATION_CODE = '1002: Invalid verification code',
  INVALID_EMAIL_PASSWORD = '1003: Invalid email or password',
  NODE_ROUTE_EXISTS = '1004: Node route already exists',
  PERMISSION_REQUIRES_PARENT = '1005: Permission must include parent node',
  ILLEGAL_OPERATION_DIRECTORY_PARENT = '1006: Illegal operation: This node only supports directory type parent node',
  ILLEGAL_OPERATION_CANNOT_CONVERT_NODE_TYPE = '1007: Illegal operation: Node type cannot be directly converted',
  ROLE_HAS_ASSOCIATED_USERS = '1008: The role has associated users, please delete the associated users first',
  DEPARTMENT_HAS_ASSOCIATED_USERS = '1009: The department has associated users, please delete the associated users first',
  DEPARTMENT_HAS_ASSOCIATED_ROLES = '1010: The department has associated roles, please delete the associated roles first',
  PASSWORD_MISMATCH = '1011: Old password does not match original password',
  LOGOUT_OWN_SESSION = '1012: If you want to log out yourself, please click on the logout option in the upper right corner',
  NOT_ALLOWED_TO_LOGOUT_USER = '1013: Not allowed to log out this user',
  PARENT_MENU_NOT_FOUND = '1014: Parent menu not found',
  DEPARTMENT_HAS_CHILD_DEPARTMENTS = '1015: The department has child departments, please delete the child departments first',
  SYSTEM_BUILTIN_FUNCTION_NOT_ALLOWED = '1016: System built-in function is not allowed to operate',
  USER_NOT_FOUND = '1017: User not found',
  UNABLE_TO_FIND_DEPARTMENT_FOR_USER = '1018: Unable to find the department to which the current user belongs',
  DEPARTMENT_NOT_FOUND = '1019: Department not found',
  DICT_NAME_EXISTS = '1020: A dictionary with the same name already exists',
  PARAMETER_CONFIG_KEY_EXISTS = '1021: Parameter configuration key-value pair already exists',
  DEFAULT_ROLE_NOT_FOUND = '1022: The default role assigned does not exist',

  INVALID_LOGIN = '1101: Invalid login, please log in again',
  NO_PERMISSION = '1102: No permission to access',
  ONLY_ADMIN_CAN_LOGIN = '1103: Only administrators can login',
  REQUEST_INVALIDATED = '1104: The current request has been invalidated',
  ACCOUNT_LOGGED_IN_ELSEWHERE = '1105: Your account is logged in elsewhere',
  GUEST_ACCOUNT_RESTRICTED_OPERATION = '1106: Guest account is not allowed to operate',
  REQUESTED_RESOURCE_NOT_FOUND = '1107: The requested resource does not exist',

  TOO_MANY_REQUESTS = '1201: Too many requests, please try again in one minute',
  MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY = '1202: Maximum of five verification codes can be sent per day',
  VERIFICATION_CODE_SEND_FAILED = '1203: Verification code sending failed',

  INSECURE_MISSION = '1301: Insecure mission, make sure to include @Mission annotation in execution',
  EXECUTED_MISSION_NOT_FOUND = '1302: Executed mission not found',
  MISSION_EXECUTION_FAILED = '1303: Mission execution failed',
  MISSION_NOT_FOUND = '1304: Mission not found',

  // OSS related
  OSS_FILE_OR_DIR_EXIST = '1401: The file or directory being created already exists',
  OSS_NO_OPERATION_REQUIRED = '1402: No operation required',
  OSS_EXCEE_MAXIMUM_QUANTITY = '1403: Exceeded the maximum quantity supported',

  //Genre
  GENRE_ALREADY_EXIST = '1403: Genre already exists',
  GENRE_NOT_EXIST = '1404: Genre is not exist',

  //movie
  MOVIE_ALREADY_EXIST = '1405: movie already exists',
  MOVIE_NOT_EXIST = '1406: movie is not exist',
}
