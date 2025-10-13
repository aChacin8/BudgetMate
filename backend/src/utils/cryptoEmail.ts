import sodium from "libsodium-wrappers";

export async function initCrypto() {
    await sodium.ready;

    const key = sodium.from_base64(
        process.env.ENCRYPTION_KEY!,
        sodium.base64_variants.ORIGINAL
    );

    function encryptEmail(email: string) {
        const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
        const ciphertext = sodium.crypto_secretbox_easy(email, nonce, key);

        return {
            encrypted: sodium.to_base64(ciphertext, sodium.base64_variants.ORIGINAL),
            nonce: sodium.to_base64(nonce, sodium.base64_variants.ORIGINAL),
        };
    }

    function decryptEmail(encrypted: string, nonce: string) {
        const decrypted = sodium.crypto_secretbox_open_easy(
            sodium.from_base64(encrypted, sodium.base64_variants.ORIGINAL),
            sodium.from_base64(nonce, sodium.base64_variants.ORIGINAL),
            key
        );

        if (!decrypted) {
            throw new Error("Failed to decrypt email: invalid key or nonce");
        }

        return sodium.to_string(decrypted);
    }

    return { encryptEmail, decryptEmail };
}
