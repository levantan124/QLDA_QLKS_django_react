import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Carousel, Col, Container, Row } from "react-bootstrap";

const RoomCarousel = () => {
  // Dữ liệu ảo thay thế
  const mockRooms = [
    {
      id: 1,
      roomType: { nameRoomType: "Deluxe Room", price: 120, image: "/path/to/deluxe-room.jpg" },
    },
    {
      id: 2,
      roomType: { nameRoomType: "Suite", price: 200, image: "/path/to/suite-room.jpg" },
    },
    {
      id: 3,
      roomType: { nameRoomType: "Standard Room", price: 80, image: "/path/to/standard-room.jpg" },
    },
    {
      id: 4,
      roomType: { nameRoomType: "Luxury Room", price: 150, image: "/path/to/luxury-room.jpg" },
    },
    {
      id: 5,
      roomType: { nameRoomType: "Single Room", price: 70, image: "/path/to/single-room.jpg" },
    },
    {
      id: 6,
      roomType: { nameRoomType: "Double Room", price: 100, image: "/path/to/double-room.jpg" },
    },
  ];

  return (
    <section className="bg-light mb-5 mt-5 shadow">
      <Link to={"/browse-all-rooms"} className="hote-color text-center">
        Browse all rooms
      </Link>
      <Container>
        <Carousel indicators={false}>
          {[...Array(Math.ceil(mockRooms.length / 4))].map((_, index) => (
            <Carousel.Item key={index}>
              <Row>
                {mockRooms.slice(index * 4, index * 4 + 4).map((room) => {
                  return (
                    <Col key={room.id} className="mb-4" xs={12} md={6} lg={3}>
                      <Card>
                        <Link to={`/book-room/${room.id}`}>
                          <Card.Img
                            variant="top"
                            src={room.roomType?.image}
                            alt="Room Photo"
                            className="w-100"
                            style={{ height: "200px" }}
                          />
                        </Link>
                        <Card.Body>
                          <Card.Title className="hotel-color">{room.roomType?.nameRoomType}</Card.Title>
                          <Card.Title className="room-price">${room.roomType?.price}</Card.Title>
                          <div className="flex-shrink-0">
                            <Link to={`/book-room/${room.id}`} className="btn btn-hotel btn-sm">
                              Book Now
                            </Link>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default RoomCarousel;
