using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IntelAgentWebApi.common
{
    using System.Reflection;

    public enum eStatus
    {
        [Description("בתהליך")]
        InProgress,
        [Description("נמחק")]
        Deleted,
        [Description("בוצע")]
        Done

    }
    class Description : Attribute
    {
        public string Text;
        public Description(string text)
        {
            Text = text;
        }

    }
    public class StockStatusGetter
    {
        public string GetDescription(Enum en)
        {

            Type type = en.GetType();

            MemberInfo[] memInfo = type.GetMember(en.ToString());

            if (memInfo != null && memInfo.Length > 0)
            {

                object[] attrs = memInfo[0].GetCustomAttributes(typeof(Description),
                                                                false);

                if (attrs != null && attrs.Length > 0)

                    return ((Description)attrs[0]).Text;

            }

            return en.ToString();

        }
    }
}