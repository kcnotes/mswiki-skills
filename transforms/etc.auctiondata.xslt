<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="yes"/>
  
  <xsl:template match="/">
    <AuctionData>
      <xsl:apply-templates select="/dir/dir[starts-with(@name, 'ItemDetailCategory_')]"/>
    </AuctionData>
  </xsl:template>
  
  <xsl:template match="/dir/dir">
    <xsl:variable name="type" select="substring-after(@name, 'ItemDetailCategory_')" />
    <xsl:element name="Type">
      <xsl:attribute name="type" select="$type"/>
      <xsl:apply-templates select="dir[@name != 'default']"/>
    </xsl:element>
  </xsl:template>
  
  <xsl:template match="/dir/dir/dir">
    <xsl:element name="SubType">
      <xsl:attribute name="type" select="@name"/>
      <xsl:apply-templates select="dir[@name != 'default']"/>
    </xsl:element>
  </xsl:template>
    
  <xsl:template match="/dir/dir/dir/dir">
    <xsl:element name="Category">
      <xsl:attribute name="category" select="@name"/>
      <xsl:attribute name="name" select="string/@value"/>
      <xsl:attribute name="begin" select="dir/int32[@name = 'begin']/@value"/>
      <xsl:attribute name="end" select="dir/int32[@name = 'end']/@value"/>
    </xsl:element>
  </xsl:template>
</xsl:stylesheet>
