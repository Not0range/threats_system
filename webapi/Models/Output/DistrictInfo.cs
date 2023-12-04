namespace webapi.Models.Output
{
    public class DistrictInfo
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string SvgTag { get; set; }
        public IEnumerable<CityInfo> Cities { get; set; }
    }
}
