const getConnectType = (artistId, currentUserId, isPartner) => {
  if (artistId === currentUserId) {
    return 'isMe';
  }

  if (isPartner) {
    return 'isArtist';
  } else {
    return 'isUser';
  }
};

export default getConnectType;
