package deploy.me

import jakarta.ws.rs.GET
import jakarta.ws.rs.Path

@Path("/hello")
class GreetingResource {

    @GET fun hello() = Greeting("hello")
}

