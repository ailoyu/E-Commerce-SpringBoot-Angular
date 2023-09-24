package com.twinkle.shopapp.services;

import com.twinkle.shopapp.dtos.OrderDTO;
import com.twinkle.shopapp.exceptions.DataNotFoundException;
import com.twinkle.shopapp.models.Order;

import java.util.List;

public interface IOrderService {
    Order createOrder(OrderDTO orderDTO) throws Exception;
    Order getOrder(Long id) throws DataNotFoundException;
    Order updateOrder(Long id, OrderDTO orderDTO) throws DataNotFoundException;
    void deleteOrder(Long id) throws DataNotFoundException;
    List<Order> findByUserId(Long userId);

}
