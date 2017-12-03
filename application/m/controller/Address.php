<?php
/**
 * Created by PhpStorm.
 * User: trrtly
 * Date: 17-12-3
 * Time: 上午11:38
 */
namespace app\m\controller;
use app\m\model\UserModel;
use think\Controller;

class Address extends Controller
{
    public function choseAddress()
    {
        return $this->fetch();
    }

    public function showLocation()
    {
        return $this->fetch();
    }

    public function queryAddress()
    {
        return $this->fetch();
    }
}