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

class Order extends Controller
{
    public function findFrontOrders()
    {
        return $this->fetch();
    }

    public function buynow()
    {
        return $this->fetch();
    }

    public function createOrder()
    {
        return $this->fetch();
    }

    public function paySuccess()
    {
        return $this->fetch();
    }
}