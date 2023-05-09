using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

namespace webapi
{
    public static class Extensions
    {
        public static int? ToInt(this string str)
        {
            if (int.TryParse(str, out var result)) return result;
            return null;
        }
    }
}
