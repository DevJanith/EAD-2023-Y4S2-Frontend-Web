// Password generation function
export function generatePassword(): string {
    const length: number = 12;
    const specialChars: string = '!@#$%^&*()_-+=<>?';
    const uppercaseChars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars: string = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars: string = '0123456789';

    const getRandomChar = (chars: string): string => {
        const randomIndex: number = Math.floor(Math.random() * chars.length);
        return chars[randomIndex];
    };

    let password: string = '';

    // Ensure at least one of each character type
    password += getRandomChar(specialChars);
    password += getRandomChar(uppercaseChars);
    password += getRandomChar(lowercaseChars);
    password += getRandomChar(numberChars);

    // Fill the rest of the password with random characters
    for (let i: number = 4; i < length; i++) {
        const charType: number = Math.floor(Math.random() * 4); // 0 for special, 1 for uppercase, 2 for lowercase, 3 for number
        switch (charType) {
            case 0:
                password += getRandomChar(specialChars);
                break;
            case 1:
                password += getRandomChar(uppercaseChars);
                break;
            case 2:
                password += getRandomChar(lowercaseChars);
                break;
            case 3:
                password += getRandomChar(numberChars);
                break;
        }
    }

    // Convert the password to an array to shuffle the characters
    const passwordArray: string[] = password.split('');
    for (let i: number = passwordArray.length - 1; i > 0; i--) {
        const j: number = Math.floor(Math.random() * (i + 1));
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }

    // Convert the shuffled array back to a string
    return passwordArray.join('');
}
