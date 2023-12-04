using webapi.Entities;

namespace webapi.Models.Output
{
    public class ThreatInfo
    {
        public int Id { get; set; }
        public ThreatsType Type { get; set; }
        public DateTime DateTime { get; set; }
        public Place Place { get; set; }
        public Source Source { get; set; }
    }

    public class Place
    {
        public int MictodistrictId { get; set; }
        public string MicrodistrictTitle { get; set; }
        public int CityId { get; set; }
        public string CityTitle { get; set; }
        public int DistrictId { get; set; }
        public string DistrictTitle { get; set; }
    }
}
