import { IdentityUser } from '../../domain/aggregates/identityUser.js';
import { RefreshToken } from '../../domain/entities/refreshToken.js';
import { DomainErrors } from '../../domain/errors/domainErrors.js';
import { DomainService } from '../../domain/service/domainService.js';
import { IdentityRepositoryPort } from '../../infrastructure/ports/IdentityRepositoryPort.js';
import { RegisterRequestDto, RegisterResponseDto } from '../dtos/domainDto.js';

export class RegisterUser {
        constructor(
                private readonly identityRepository: IdentityRepositoryPort,
                private readonly domainService: DomainService // private readonly eventDispatcher : EventBusPort
        ) {}

        async execute(data: RegisterRequestDto): Promise<RegisterResponseDto> {
                const { email, password, firstName, lastName } = data;

                console.log(`entered usecase ----- ${email}`);

                const userExists = await this.identityRepository.existsByEmail(email);

                console.log('db operation to find user success');

                if (userExists) throw new DomainErrors.UserAlreadyExistsError();

                const passwordHash = await this.domainService.encryptPassword(password);

                console.log('password encrypt success');

                const identityUser = IdentityUser.create({
                        email,
                        firstName,
                        lastName,
                        passwordHash
                });

                const { value, expiry } = this.domainService.generateRefreshTokenWithExpiry();

                const refreshToken = RefreshToken.create({
                        value,
                        identityUserId: identityUser.id,
                        expiresAt: expiry
                });

                identityUser.addRefreshToken(refreshToken);

                await this.identityRepository.save(identityUser);

                const claim = identityUser.getClaims();

                const accessToken = this.domainService.generateAccessToken(claim);

                //DISPATCH DOMAIN EVENTS

                return {
                        message: 'Regisration successful ',
                        data: {
                                email,
                                firstName,
                                lastName
                        },
                        tokens: {
                                accessToken,
                                refreshToken: value
                        }
                };
        }
}
