package deploy.me

import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient

@RegisterRestClient(baseUri = "https://api.chucknorris.io/jokes")
interface ChuckServiceclient {
    @GET @Path("/random") @Produces(MediaType.APPLICATION_JSON) fun getRandomJoke(): JokeResponse
}
