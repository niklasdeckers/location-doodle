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
        $uuid=$this->getUniqueIdentifier();

        $em = $this->getDoctrine()->getManager();

        $RAW_QUERY = 'INSERT INTO client (auth_token) VALUES (:uuid);';

        $statement = $em->getConnection()->prepare($RAW_QUERY);
        // Set parameters
        $statement->bindValue('uuid', $uuid);
        $statement->execute();

        //$result = $statement->fetchAll();

        return new JsonResponse(hash('sha512',$uuid ));
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