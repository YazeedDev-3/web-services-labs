using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using lab_9_webService_Docker;

namespace lab_9_webService_Docker.Data
{
    public class lab_9_webService_DockerContext : DbContext
    {
        public lab_9_webService_DockerContext (DbContextOptions<lab_9_webService_DockerContext> options)
            : base(options)
        {
        }

        public DbSet<lab_9_webService_Docker.Customer> Customer { get; set; } = default!;
    }
}
