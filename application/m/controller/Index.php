<?php
namespace app\m\controller;
use think\controller;

class Index extends controller
{
    public function index()
    {
        $data = ['name'=>'thinkphp','url'=>'thinkphp.cn'];
        return ['data'=>$data,'code'=>1,'message'=>'操作完成'];
    }
}
