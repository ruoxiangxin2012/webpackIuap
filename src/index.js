//加载CSS
import '../vendor/uui/css/u.css'
import '../vendor/uui/css/grid.css'
import './index.scss'
import './config/router'

let togglebutton = $("#frame-menubutton").find("i"),
    togglebar = $("#frame-menubar");
    togglebutton.unbind().bind("click",function(){
        togglebar.toggleClass("u-menubar-open");

        $("main").toggleClass("content-fullScreen");
        togglebutton.each(function(){

            if($(this).hasClass("hide")){
                $(this).removeClass("hide");
            }else{
                $(this).addClass("hide");
            }
        })
    })




