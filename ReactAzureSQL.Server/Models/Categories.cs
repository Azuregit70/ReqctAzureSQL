namespace ReactAzureSQL.Server.Models
{
    public class Categories
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Products> products { get; set; } = new List<Products>();
    }
}
