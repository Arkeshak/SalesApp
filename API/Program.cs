using API.Infrastructure.Data;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null
        )
    ));

// Add AutoMapper — scan this assembly for MappingProfile
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Register Repositories
builder.Services.AddScoped<API.Application.Interfaces.IClientRepository, API.Infrastructure.Repositories.ClientRepository>();
builder.Services.AddScoped<API.Application.Interfaces.IItemRepository, API.Infrastructure.Repositories.ItemRepository>();
builder.Services.AddScoped<API.Application.Interfaces.IOrderRepository, API.Infrastructure.Repositories.OrderRepository>();

// Register Services
builder.Services.AddScoped<API.Application.Interfaces.IClientService, API.Application.Services.ClientService>();
builder.Services.AddScoped<API.Application.Interfaces.IItemService, API.Application.Services.ItemService>();
builder.Services.AddScoped<API.Application.Interfaces.IOrderService, API.Application.Services.OrderService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();
app.Run();
