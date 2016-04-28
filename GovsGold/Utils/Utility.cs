using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MiscUtil;
using System.Collections.Concurrent;

namespace GovsGold.Utils
{
    // C# doesnt provide a way to specify a numeric type constraint on generics.
    // http://www.codeproject.com/Articles/8531/Using-generics-for-calculations
    // One workaround is to use a dynamically compiled class to implement the arithmetic operators
    // http://www.yoda.arachsys.com/csharp/miscutil/usage/genericoperators.html

    class Average
    {
        public static T Median<T>(T[] data) where T : IComparable
        {
            if (data.Length == 0)
                return (Operator<T>.Zero);

            Array.Sort(data);

            if (data.Length == 0)
            {
                return (Operator<T>.Zero);
                throw new InvalidOperationException("Empty collection");
            }
            else if (data.Length % 2 == 0)
            {
                // count is even, average two middle elements
                T sum = Operator.Add(data[data.Length / 2 - 1], data[data.Length / 2]);
                return Operator.DivideInt32(sum, 2);
            }
            else
            {
                // count is odd, return the middle element
                return data[data.Length / 2];
            }
        }

        // Add others - Mean, Olympian...
    }

    class FixedSizeConcurrentQueue<T> : ConcurrentQueue<T>
    {

        private readonly object syncObject = new object();

        public int Size { get; private set; }

        public FixedSizeConcurrentQueue(int size)
        {
            Size = size;
        }

        public new void Enqueue(T obj)
        {
            base.Enqueue(obj);
            lock (syncObject)
            {
                while (base.Count > Size)
                {
                    T outObj;
                    base.TryDequeue(out outObj);
                }
            }
        }
    }
}
