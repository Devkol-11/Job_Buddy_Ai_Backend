export interface RegisterRequestDto {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
}

export interface RegisterResponseDto {
        message: string;
        data: { email: string; firstName: string; lastName: string };
}
