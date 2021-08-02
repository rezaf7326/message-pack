/*
    Types
        - Integer represents an integer
        - Nil represents nil
        - Boolean represents true or false
        - Float represents a IEEE 754 double precision floating point number including NaN and Infinity
        - Raw
            * String extending Raw type represents a UTF-8 string
            * Binary extending Raw type represents a byte array
        - Array represents a sequence of objects
        - Map represents key-value pairs of objects
        - Extension represents a tuple of type information and a byte array where type information is an integer whose meaning is defined by applications or MessagePack specification
            * Timestamp represents an instantaneous point on the time-line in the world that is independent from time zones or calendars. Maximum precision is nanoseconds.

    Limitation
        a value of an Integer object is limited from -(2^63) upto (2^64)-1
        maximum length of a Binary object is (2^32)-1
        maximum byte size of a String object is (2^32)-1
        String objects may contain invalid byte sequence and the behavior of a deserializer depends on the actual implementation when it received invalid byte sequence
            Deserializers should provide functionality to get the original byte array so that applications can decide how to handle the object
        maximum number of elements of an Array object is (2^32)-1
        maximum number of key-value associations of a Map object is (2^32)-1

        

*/


