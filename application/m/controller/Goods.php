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

class Goods extends Controller
{
    public function sort()
    {
        return $this->fetch();
    }

    public function search()
    {
        return $this->fetch();
    }

    public function detail()
    {
        return $this->fetch();
    }
}