package com.wenqiang.action;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


/**
 * Created by yangqj on 2017/4/21.
 */
@Controller
@RequestMapping("map")
public class MapPageController extends BaseController {

	@Autowired
	private Environment env;
	
	
	
  @RequestMapping(value="/gugeMap",method= RequestMethod.GET)
    public String login(){
        return "gugeMap";
    }


    @RequestMapping(value="/tubaMap",method= RequestMethod.GET)
    public String rolesPage(){
    	
        return "tubaMap";
    }

    @RequestMapping("/resourcesPage")
    public String resourcesPage(){
        return "resources/resources";
    }

    @RequestMapping("/403")
    public String forbidden(){
        return "403";
    }
}
