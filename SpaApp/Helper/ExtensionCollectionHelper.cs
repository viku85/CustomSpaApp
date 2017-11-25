using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpaApp.Helper
{
    /// <summary>
    /// Collection helper functions.
    /// </summary>
    public static class ExtensionCollectionHelper
    {
        /// <summary>
        /// Safely add item in dictionary.
        /// </summary>
        /// <typeparam name="TKey">The type of the key.</typeparam>
        /// <typeparam name="TValue">The type of the value.</typeparam>
        /// <param name="dictionary">The dictionary.</param>
        /// <param name="key">The key.</param>
        /// <param name="value">The value.</param>
        /// <returns>Passed dictionary with added item, based on existence of key.</returns>
        /// <exception cref="ArgumentNullException">dictionary</exception>
        public static IDictionary<TKey, TValue> SafeAdd<TKey, TValue>(
            this IDictionary<TKey, TValue> dictionary, TKey key, TValue value)
        {
            dictionary = dictionary ?? new Dictionary<TKey, TValue>();

            if (EqualityComparer<TKey>.Default.Equals(key, default(TKey)) ||
                EqualityComparer<TValue>.Default.Equals(value, default(TValue)))
            {
                return dictionary;
            }

            if (!dictionary.ContainsKey(key))
            {
                dictionary.Add(key, value);
            }

            return dictionary;
        }

        public static bool IfNotEmpty<TKey, TValue>(
            this IDictionary<TKey, TValue> dictionary, Action action)
        {
            var hasData = dictionary.Keys.Any();
            if (hasData)
            {
                action();
            }

            return hasData;
        }
    }
}