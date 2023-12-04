using webapi.Models.Input;

namespace webapi.Models.Output
{
    public class SummaryResult
    {
        public SummaryForm Query { get; set; }
        public IEnumerable<ThreatByType> Threats { get; set; }
    }
}
