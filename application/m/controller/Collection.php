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

class Collection extends Controller
{
    public function newSale()
    {
        return $this->fetch();
    }

    public function boutique()
    {
        return $this->fetch();
    }

    public function hc()
    {
        return $this->fetch();
    }
}