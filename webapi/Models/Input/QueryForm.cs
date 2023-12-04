namespace webapi.Models.Input
{
    public class SummaryForm
    {
        public DateTime? BeginDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DistrictId { get; set; }
        public int? CityId { get; set; }
        public int? MicrodistrictId { get; set; }
    }

    public class QueryForm : SummaryForm
    {
        public Axis Axis { get; set; }
    }

    public enum Axis
    {
        Date,
        District,
        City,
        Microdistrict
    }
}
