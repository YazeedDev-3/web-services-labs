using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using WebAPI_lab2.Models;

namespace WebAPI_lab2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly string _connectionString;

        // Read the connection string from appsettings.json once at construction time
        public ClientController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        // GET api/Client/{name} — returns a single client matched by name
        [HttpGet("{name}")]
        public ActionResult<Client> Get(string name)
        {
            try
            {
                using SqlConnection conn = new SqlConnection(_connectionString);
                // Parameterized query prevents SQL injection
                string sql = "SELECT * FROM Clients WHERE name = @name";
                using SqlCommand comm = new SqlCommand(sql, conn);
                comm.Parameters.AddWithValue("@name", name);
                conn.Open();
                using SqlDataReader reader = comm.ExecuteReader();
                if (reader.Read())
                {
                    return new Client
                    {
                        Id = (int)reader["id"],
                        Name = (string)reader["name"],
                        phoneNumber = (string)reader["phoneNumber"],
                        Email = (string)reader["email"],
                        Address = (string)reader["address"]
                    };
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        // GET api/Client — returns all clients
        [HttpGet]
        public ActionResult<IEnumerable<Client>> GetAll()
        {
            try
            {
                List<Client> clients = new List<Client>();
                using SqlConnection conn = new SqlConnection(_connectionString);
                string sql = "SELECT * FROM Clients";
                using SqlCommand comm = new SqlCommand(sql, conn);
                conn.Open();
                using SqlDataReader reader = comm.ExecuteReader();
                while (reader.Read())
                {
                    clients.Add(new Client
                    {
                        Id = (int)reader["Id"],
                        Name = (string)reader["name"],
                        phoneNumber = (string)reader["phoneNumber"],
                        Email = (string)reader["email"],
                        Address = (string)reader["address"]
                    });
                }
                return clients;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        // POST api/Client — inserts a new client record
        [HttpPost]
        public ActionResult<string> Post([FromBody] Client cli)
        {
            try
            {
                using SqlConnection conn = new SqlConnection(_connectionString);
                string sql = "INSERT INTO Clients (name, phoneNumber, email, address) VALUES (@name, @phoneNumber, @email, @address)";
                using SqlCommand comm = new SqlCommand(sql, conn);
                comm.Parameters.AddWithValue("@name", cli.Name);
                comm.Parameters.AddWithValue("@phoneNumber", cli.phoneNumber);
                comm.Parameters.AddWithValue("@email", cli.Email);
                comm.Parameters.AddWithValue("@address", cli.Address);
                conn.Open();
                comm.ExecuteNonQuery();
                return "Client successfully added";
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        // PUT api/Client/{id} — updates an existing client by ID
        [HttpPut("{id}")]
        public ActionResult<string> Put(int id, [FromBody] Client cli)
        {
            try
            {
                using SqlConnection conn = new SqlConnection(_connectionString);
                string sql = "UPDATE Clients SET name = @name, phoneNumber = @phoneNumber, email = @email, address = @address WHERE id = @id";
                using SqlCommand comm = new SqlCommand(sql, conn);
                comm.Parameters.AddWithValue("@name", cli.Name);
                comm.Parameters.AddWithValue("@phoneNumber", cli.phoneNumber);
                comm.Parameters.AddWithValue("@email", cli.Email);
                comm.Parameters.AddWithValue("@address", cli.Address);
                comm.Parameters.AddWithValue("@id", id);
                conn.Open();
                comm.ExecuteNonQuery();
                return "Client successfully updated";
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        // DELETE api/Client/{id} — removes a client record by ID
        [HttpDelete("{id}")]
        public ActionResult<string> Delete(int id)
        {
            try
            {
                using SqlConnection conn = new SqlConnection(_connectionString);
                string sql = "DELETE FROM Clients WHERE id = @id";
                using SqlCommand comm = new SqlCommand(sql, conn);
                comm.Parameters.AddWithValue("@id", id);
                conn.Open();
                comm.ExecuteNonQuery();
                return "Client successfully deleted";
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }
    }
}
