import './App.css';
import {useEffect, useMemo, useState} from "react";
import axios from 'axios';
import {useTable} from 'react-table';

function App() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersResponse = await axios.get('http://localhost:3000/orders')
                const productsResponse = await axios.get('http://localhost:3000/products')
                setOrders(ordersResponse.data);
                setProducts(productsResponse.data);
            } catch (error) {
                console.log("Error fetching data: " ,error);
            }
        }
        fetchData();
    }, [])

    const data = useMemo(() =>
        orders.map((order, index) => {
            const product = products.find(product => product.id === order.productId);
            return {
                stt: index + 1,
                orderCode: order.orderCode,
                productName: product ? product.name : 'Unknown',
                price: product ? `$${product.price}` : 'N/A',
                category: product ? product.category : 'N/A',
                buyingDay: order.buyingDay,
                quantity: order.quantity,
                total: `$${order.total}`,
            }
        }), [orders, products]);

    const columns = useMemo(() => [
        {Header: 'STT', accessor: 'stt'},
        {Header: 'Mã đơn hàng', accessor: 'orderCode'},
        {Header: 'Tên sản phẩm', accessor: 'productName'},
        {Header: 'Giá (USD)', accessor: 'price'},
        {Header: 'Loại sản phẩm', accessor: 'category'},
        {Header: 'Ngày mua', accessor: 'buyingDay'},
        {Header: 'Số lượng', accessor: 'quantity'},
        {Header: 'Tổng tiền', accessor: 'total'},
        {
            Header: 'Thao tác',
            Cell: ({row}) => (
                <button onClick={() => console.log("hello world")}>
                    Cập Nhật
                </button>
            )
        }
    ], [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({columns, data})

  return (
    <div className="App">
      <h1>Thống kê đơn hàng</h1>
        <table {...getTableProps()} className="table">
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => (
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        ))}
                    </tr>
                )
            })}
            </tbody>
        </table>
    </div>
  );
}

export default App;
