import { RefreshToken } from '../../domain/entities/refreshToken.js';
import { DomainErrors } from '../../domain/errors/domainErrors.js';
import { DomainService } from '../../domain/service/domainService.js';
import { IdentityRepositoryPort } from '../../infrastructure/ports/IdentityRepositoryPort.js';
import { LoginRequestDto, LoginResponseDto } from '../dtos/domainDto.js';

export class LoginUser {
        constructor(
                private readonly identityRepository: IdentityRepositoryPort,
                private readonly domainService: DomainService
        ) {}

        async execute(data: LoginRequestDto): Promise<LoginResponseDto> {
                const { email, password } = data;

                // 1. Find user
                const identityUser = await this.identityRepository.findByEmail(email);
                if (!identityUser) {
                        throw new DomainErrors.InvalidCredentialsError();
                }

                // 2. Verify Password
                const isPasswordValid = await this.domainService.decryptPassword({
                        plainPassword: password,
                        encryptedPassword: identityUser.props.passwordHash
                });

                if (!isPasswordValid) {
                        throw new DomainErrors.InvalidCredentialsError();
                }

                // 3. Generate new Refresh Token
                const { value, expiry } = this.domainService.generateRefreshTokenWithExpiry();

                const refreshToken = RefreshToken.create({
                        value,
                        identityUserId: identityUser.id,
                        expiresAt: expiry
                });

                // 4. Update Aggregate state (Add the new token)
                identityUser.addToken(refreshToken);

                // 5. Persist the Aggregate
                await this.identityRepository.save(identityUser);

                // 6. Generate Access Token
                const claims = identityUser.getClaims();
                const accessToken = this.domainService.generateAccessToken(claims);

                // 7. Dispatch Domain Events (e.g., UserLoggedInEvent)
                // const events = identityUser.pullDomainEvents();
                // await this.eventDispatcher.dispatch(events);

                return {
                        message: 'Login successful',
                        data: {
                                id: identityUser.id,
                                email: identityUser.props.email,
                                firstName: identityUser.props.firstName,
                                lastName: identityUser.props.lastName
                        },
                        tokens: {
                                accessToken,
                                refreshToken: value
                        }
                };
        }
}
