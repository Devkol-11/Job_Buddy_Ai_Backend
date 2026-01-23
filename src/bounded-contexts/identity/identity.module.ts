import { RegisterUser } from './application/usecases/registerUser.js';
import { LoginUser } from './application/usecases/loginUser.js';
import { LogoutUser } from './application/usecases/logoutUser.js';
import { ResetPassword } from './application/usecases/resetPassword.js';
import { ForgotPassword } from './application/usecases/forgotPassword.js';
import { IdentityRepository } from './infrastructure/adapters/identityRepository.js';
import { DomainService } from './domain/service/domainService.js';

const identityRepository = new IdentityRepository();
const domainService = new DomainService();

export const usecase = {
        register: new RegisterUser(identityRepository, domainService),
        login: new LoginUser(identityRepository, domainService),
        logout: new LogoutUser(identityRepository),
        forgotPassword: new ForgotPassword(identityRepository, domainService),
        resetPassword: new ResetPassword(identityRepository, domainService)
};
