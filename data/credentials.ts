type CredentialVariable =
    | 'SWAG_LABS_USERNAME'
    | 'SWAG_LABS_PASSWORD'
    | 'SWAG_LABS_LOCKED_OUT_USERNAME';

export function getRequiredCredential(name: CredentialVariable): string {
    const value = process.env[name];
    if (!value?.trim()) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}
