<?php

namespace App\Controller;

use App\Repository\AuthRepository;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;

class AuthController extends FOSRestController
{
    /**
     * @var AuthRepository
     */
    private $repository;

    /**
     * @param AuthRepository $repository
     */
    public function __construct(AuthRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @return JsonResponse
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getAuthAction()
    {
        return new JsonResponse($this->repository->getAuthToken());
    }
}