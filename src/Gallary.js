import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Pagination,
  Typography,
  Input,
  Modal,
  Spin,
  Empty,
  Select,
  FloatButton,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;

const API_KEY = "Utv73WAxxH3Z2JzhosGfcfyVDuZzut22nB0xEE4QGLLT5XZnHFBm9Z1e"; // 🔑 Put your actual API key here
const PER_PAGE = 10;

const VideoGallery = (props) => {
  const [videos, setVideos] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState("nature");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState([]);

  const [type, settype] = useState("");
  const fetchVideos = async (searchQuery, pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.pexels.com/videos/search?query=${searchQuery}&per_page=${PER_PAGE}&page=${pageNum}`,
        {
          headers: {
            Authorization: API_KEY,
          },
        }
      );
      const data = await res.json();
      setVideos(
        data.videos.filter((e) => e.width === 1920 && e.height === 1080)
      );
      setTotalResults(data.total_results);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/downloads/${type}`);
      const data = await res.json();
      setSelectedVideo(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const pushDownloads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/upload_downloads`, {
        method: "POST",
        body: JSON.stringify(selectedVideo),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setSelectedVideo([]);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type) fetchVideos(query, page);
  }, [query, page, type]);

  useEffect(() => {
    fetchDownloads();
  }, [type]);
  const onSearch = (value) => {
    setQuery(value);
    setPage(1);
  };

  const handleVideoClick = (video) => {
    let tmpVideos = [...selectedVideo];
    let tmpIndex = tmpVideos.findIndex((e) => e.video_id === video.id);
    if (tmpIndex !== -1) {
      tmpVideos.splice(tmpIndex, 1);
      setSelectedVideo(tmpVideos);
    } else {
      tmpVideos.push({ video_id: video.id, url: video.url, channel: type });
      setSelectedVideo(tmpVideos);
    }
  };
  return (
    <div style={{ padding: "40px", background: "#f0f2f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: 400, margin: "0 auto 40px" }}>
        <Search
          placeholder="Search videos..."
          enterButton
          allowClear
          size="large"
          onSearch={onSearch}
        />
        <Select
          options={props.channals.map((channal) => ({
            value: channal,
            label: channal.toUpperCase(),
          }))}
          defaultValue={type}
          onChange={(value) => settype(value)}
          placeholder="Select Channal"
          size="large"
          style={{ width: "100%", marginTop: 20 }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 100 }}>
          <Spin size="large" />
        </div>
      ) : videos.length > 0 ? (
        <>
          <Row gutter={[24, 24]}>
            {videos.map((video) => (
              <Col key={video.id} xs={24} sm={12} md={8}>
                <Card
                  style={
                    selectedVideo.findIndex((item) => item.id === video.id) ===
                    -1
                      ? { height: "500px", width: "500px" }
                      : { height: "400px", width: "400px" }
                  }
                  hoverable
                  cover={
                    <video
                      src={video.video_files[0]?.link}
                      controls={false}
                      muted
                      style={{ width: "100%", borderRadius: 8 }}
                      onClick={() => handleVideoClick(video)}
                      onMouseOver={(e) => {
                        var video = e.target;
                        var isPlaying =
                          video.currentTime > 0 &&
                          !video.paused &&
                          !video.ended &&
                          video.readyState > video.HAVE_CURRENT_DATA;
                        if (!isPlaying) {
                          video.play();
                        }
                      }}
                      onMouseOut={(e) => e?.target?.pause()}
                    />
                  }
                  //title={video.user.name}

                  bordered={false}
                />
              </Col>
            ))}
          </Row>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Pagination
              current={page}
              total={totalResults}
              pageSize={PER_PAGE}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
          <FloatButton
            onClick={pushDownloads}
            icon={<UploadOutlined />}
            badge={{ count: selectedVideo?.length }}
          />
        </>
      ) : (
        <Empty description="No videos found" style={{ marginTop: 100 }} />
      )}

      {/* Preview Modal */}
      {/* <Modal
        open={showModel}
        onCancel={() => setShowModel(!showModel)}
        footer={null}
        width={720}
      >
        {selectedVideo && (
          <video
            src={
              selectedVideo.video_files.find((f) => f.quality === "hd")?.link ||
              selectedVideo.video_files[0].link
            }
            controls
            autoPlay
            style={{ width: "100%", borderRadius: 8 }}
          />
        )}
      </Modal> */}
    </div>
  );
};

export default VideoGallery;
