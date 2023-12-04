namespace webapi.Models.Output
{
    public class CityInfo
    {
        public int Id { get; set; }
        public int DistrictId { get; set; }
        public string Title { get; set; }
        public string SvgTag { get; set; }
        public IEnumerable<MicrodistrictInfo> Microdistricts { get; set;}
    }
}
