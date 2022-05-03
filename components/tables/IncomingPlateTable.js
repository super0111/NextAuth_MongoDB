import useSWR from "swr";
import dateformat from "dateformat"

async function fetcherFunc(url){
    const res = await fetch(url);
    return res.json();
    }
export default function IncomingPlateTable(props) {
      const { searchItem } = props;
      const url ='/api/plates';
      const { data,error } = useSWR(url, fetcherFunc, {initialProps: props, revalidateOnMount: true, refreshInterval: 3000});
      if (error) return <div>failed to load</div>
      if (!data) return <div>loading...</div>
    //   console.log(data)
      
    return (
        <div>
            <div className="flex flex-col rounded-2xl shadow-2xl">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md sm:text-lg font-medium text-gray-500 uppercase tracking-wider"
                            >
                               Detected Plates
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md sm:text-lg font-medium text-gray-500 uppercase tracking-wider"
                            >
                               Plate #
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md sm:text-lg font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Name/Location
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-md sm:text-lg font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Time
                            </th>
                           
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.plates.filter((val) => {
                                // console.log(val?.plateNum,searchItem)
                            if(searchItem === ''){
                                return val
                            } else if (
                                dateformat(val.updatedAt ? val.updatedAt : val.createdAt, "mm/dd/yy - h:MM:ss TT ").toLowerCase().includes(searchItem.toLowerCase()) 
                                || val?.plateNum.toLowerCase().includes(searchItem.toLowerCase())  
                            ){
                                return val
                            }})
                        // .sort((a, b) => {
                            //     a = a.name.toLowerCase();
                            //     b = b.name.toLowerCase();
                            //     return a < b ? -1 : a > b ? 1 : 0;
                            // })
                            .map((plate) => (
                            <tr key={plate._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex row items-center"> 
                                        <img className="max-w-[200px]" height="6.4rem"  src={"https://skyvr-av-auth2-rel.s3.amazonaws.com/u17/m253264/c252827/20220111/214918.997972_livig_d0_u.jpg?AWSAccessKeyId=ASIAWEOIJQJ5V3PZ5QAB&Expires=1641959609&x-amz-security-token=IQoJb3JpZ2luX2VjEB4aCXVzLWVhc3QtMSJIMEYCIQDn47Fv5dra0u0LvJ2qnBUE%2BnXSDcA6N8MKCB26A%2BKxxAIhAKs8ooNX1gF0ZGTrTdPrt1dDtLxrwGCXbn9atB1ibznuKvoDCDcQABoMNDIxODYzNzE5NTQ3Igz1pbaBEG53b4oI6Vkq1wOqrUqKAMUiH%2B6a1RIxCklSNzvewrudfvlqEg7LWaRoT6rdc4GEdN9KrQKLLLFiZPSed7LfwtBF2g9BdBPtZ%2B0mJnqgIaZFEnoHSZukBhd6hQT0XI3%2BZwqkplw8Sz5WSXM3fhzs9lroK11t4mOxtC0Qq4ljwjVhdL9ejT4wX%2BNMwmDM48qbKogwwALzC7TJTBV0pwNFYdTw2O%2BWlJuMWXFonuYCczPokLnNX2maQR7oOss8ktsS8UHJxQ6amNnawk4%2Be51i1AxxMf2S1jjLheCSz6HDke%2Fpy8K87Vm9t8bVgjOHj1ya%2BvqLeAxkz1EK2nxHe3jVLiGNmu5E17xqDbbEOQeEQMYH637QAIwqru9vDvXIuik49BeEzWoaGVKntSNc9SzRiPw2s8%2BJh0M4nLW9cKmQbsV%2B4Y96MAOKjZ2XmpbvnUz7qlFaq97QNiTr%2FlGvRWTfgnowRzLU39tNh9%2BMhDcBC5UlDcXW%2Fx8PgxkV9ZV7bglto6rgUq6mMyG8Zxk8BB1lJozg7BboKycyjMVLfUiL55sfLl3CEbkJbw9eqEW0q89OdKfINJrmhWPCaOpDxBKd5qwcNUMYVH7QdMehdNynbyYhiytcmTGVWv%2FHTtcvliG1kisw6vT3jgY6pAGf9F4sLZB3fp6U%2BbU8zAXp46j%2BAX8fi5JnKa%2BJ46E9lk6qOW9JhfjmM%2FPRo%2FXH3jDzsVYQIrKkkW%2Bq3gNfJ6bVgfj%2FjCZq64mxnlxuGshREpnDyj3uK0gZmVPSSWaZ2rJ4W05KBakV0fii6FGB3oJkSczKc8OWnLRtCoE28IcJQiLPNZnV8pWEhRV5yhoioM51eieXXTsd%2Be2bF%2FMW8%2FY%2BLEN6%2FA%3D%3D&Signature=3Ed0Pr4IYEDEOdDp%2BXnX6Wo7orU%3D"} alt="" />
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                 <span className="text-base md:ml-2 lg:ml-2">{plate.plateNum}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-md sm:text-lg leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        Garage LPR
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                                    {dateformat(plate.updatedAt ? plate.updatedAt : plate.createdAt, "mm/dd/yy - h:MM:ss TT ")}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                </div>
        </div>
    )
}
