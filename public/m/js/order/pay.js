
//去支付
function goPayment(serialnumber,totalFee,giftCardPrice,rechargeCardPrice){
    var template = $('#template').val();
    if(template!=null){
        location.href="/pay/index?showwxpaytitle=1&body="+serialnumber+"&serialNumber="+serialnumber+"&totalFee="+totalFee+"&giftCardPrice="+giftCardPrice+"&rechargeCardPrice="+rechargeCardPrice+"&template="+template;
    }else{
        location.href="/pay/index?showwxpaytitle=1&body="+serialnumber+"&serialNumber="+serialnumber+"&totalFee="+totalFee+"&giftCardPrice="+giftCardPrice+"&rechargeCardPrice="+rechargeCardPrice;
    }
};
