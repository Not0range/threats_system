namespace webapi.Models.Output
{
    public class Pagination<T>
    {
        public IEnumerable<T> Result { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int Count { get; set; }
        public int TotalCount { get; set; }
    }
}
