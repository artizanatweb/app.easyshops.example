<?php


namespace App\Traits;

use App\Models\User;

trait UserWithTokens
{
    protected function clearAccessTokens(User $user)
    {
        $tokenRepository = app('Laravel\Passport\TokenRepository');
        $refreshTokenRepository = app('Laravel\Passport\RefreshTokenRepository');

        $tokenId = optional($user->token())->id;
        if (!$tokenId) {
            return;
        }

        $tokenRepository->revokeAccessToken($tokenId);
        $refreshTokenRepository->revokeRefreshTokensByAccessTokenId($tokenId);
    }
}
