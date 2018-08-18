<?php

namespace App\Controller;

use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;

class AuthController extends FOSRestController
{
    /**
     * @return JsonResponse
     */
    public function getAuthAction()
    {
        // TODO: write to database
        return new JsonResponse(hash('sha512', $this->getUniqueIdentifier()));
    }

    /**
     * @return string
     */
    private function getUniqueIdentifier()
    {
        $now = new \DateTime();

        return uniqid($now->getTimestamp());
    }
}