package deploy.me

import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.rest.client.inject.RestClient

@Path("/random")
class GreetingResource(@RestClient private val chuckServiceClient: ChuckServiceclient) {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    fun hello(): String {
        val response = chuckServiceClient.getRandomJoke()
        return response.value
    }
}
