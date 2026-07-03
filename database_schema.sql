IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Clients] (
    [Id] int NOT NULL IDENTITY,
    [CustomerName] nvarchar(max) NOT NULL,
    [Address1] nvarchar(max) NULL,
    [Address2] nvarchar(max) NULL,
    [Address3] nvarchar(max) NULL,
    [Suburb] nvarchar(max) NULL,
    [State] nvarchar(max) NULL,
    [PostCode] nvarchar(max) NULL,
    CONSTRAINT [PK_Clients] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Items] (
    [Id] int NOT NULL IDENTITY,
    [ItemCode] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_Items] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Orders] (
    [Id] int NOT NULL IDENTITY,
    [ClientId] int NOT NULL,
    [InvoiceNo] nvarchar(max) NOT NULL,
    [InvoiceDate] datetime2 NOT NULL,
    [ReferenceNo] nvarchar(max) NULL,
    [Note] nvarchar(max) NULL,
    [TotalExcl] decimal(18,2) NOT NULL,
    [TotalTax] decimal(18,2) NOT NULL,
    [TotalIncl] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_Orders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Orders_Clients_ClientId] FOREIGN KEY ([ClientId]) REFERENCES [Clients] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [OrderLines] (
    [Id] int NOT NULL IDENTITY,
    [OrderId] int NOT NULL,
    [ItemId] int NOT NULL,
    [Description] nvarchar(max) NULL,
    [Note] nvarchar(max) NULL,
    [Quantity] int NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [TaxRate] decimal(18,2) NOT NULL,
    [ExclAmount] decimal(18,2) NOT NULL,
    [TaxAmount] decimal(18,2) NOT NULL,
    [InclAmount] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_OrderLines] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OrderLines_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_OrderLines_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE
);
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Address1', N'Address2', N'Address3', N'CustomerName', N'PostCode', N'State', N'Suburb') AND [object_id] = OBJECT_ID(N'[Clients]'))
    SET IDENTITY_INSERT [Clients] ON;
INSERT INTO [Clients] ([Id], [Address1], [Address2], [Address3], [CustomerName], [PostCode], [State], [Suburb])
VALUES (1, N'123 Main St', N'Apt 4B', NULL, N'John Doe', N'62701', N'IL', N'Springfield'),
(2, N'456 Oak Ave', NULL, NULL, N'Jane Smith', N'10001', N'NY', N'Metropolis');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Address1', N'Address2', N'Address3', N'CustomerName', N'PostCode', N'State', N'Suburb') AND [object_id] = OBJECT_ID(N'[Clients]'))
    SET IDENTITY_INSERT [Clients] OFF;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Description', N'ItemCode', N'Price') AND [object_id] = OBJECT_ID(N'[Items]'))
    SET IDENTITY_INSERT [Items] ON;
INSERT INTO [Items] ([Id], [Description], [ItemCode], [Price])
VALUES (1, N'Laptop', N'ITM001', 1200.0),
(2, N'Mouse', N'ITM002', 25.0),
(3, N'Keyboard', N'ITM003', 75.0);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Description', N'ItemCode', N'Price') AND [object_id] = OBJECT_ID(N'[Items]'))
    SET IDENTITY_INSERT [Items] OFF;
GO

CREATE INDEX [IX_OrderLines_ItemId] ON [OrderLines] ([ItemId]);
GO

CREATE INDEX [IX_OrderLines_OrderId] ON [OrderLines] ([OrderId]);
GO

CREATE INDEX [IX_Orders_ClientId] ON [Orders] ([ClientId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260703144403_InitialCreate', N'8.0.0');
GO

COMMIT;
GO

