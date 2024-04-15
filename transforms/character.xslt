<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="yes"/>
  
  <xsl:template match="/">
    <Equip>
      <xsl:apply-templates select="/dir/dir"/>
    </Equip>
  </xsl:template>
  
  <!-- Replace <dir name="Cap"> with <Cap> -->
  <xsl:template match="/dir/dir">
    <xsl:for-each select="string|int16|int32|int64">
      <xsl:attribute name="{@name}">
        <xsl:value-of select="@value"/>
      </xsl:attribute>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
