using webapi.Models.Input;

namespace webapi.Models.Output
{
    public class StatsModel
    {
        public QueryForm Query { get; set; }
        public IEnumerable<StatsItem> Threats { get; set; }
        public IEnumerable<StatsItem> Limits { get; set; }
    }

    public class StatsItem
    {
        public string Key { get; set; }
        public IEnumerable<Pair> Values { get; set; }
    }
    public class Pair
    {
        public string Key { get; set; }
        public int Value { get; set; }

        public Pair(string key, int value)
        {
            Key = key;
            Value = value;
        }
    }
}
